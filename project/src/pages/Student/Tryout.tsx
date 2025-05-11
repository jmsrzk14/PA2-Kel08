import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface TryoutItem {
  id: number;
  id_paket: number;
  nama_paket: string;
}

const Tryout: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<TryoutItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/student/myPacket", {
          withCredentials: true,
        });

        const packets = response.data;

        const packetsWithNames = await Promise.all(
          packets.map(async (packet: { id: number; id_paket: number }) => {
            try {
              const paketResponse = await axios.get(`http://localhost:8000/admin/viewPacket/${packet.id_paket}`);
              return {
                ...packet,
                nama_paket: paketResponse.data.nama_paket,
              };
            } catch (error) {
              console.error(`Gagal ambil paket ${packet.id_paket}`, error);
              return {
                ...packet,
                nama_paket: "Nama Paket Tidak Ditemukan",
              };
            }
          })
        );

        setData(packetsWithNames);
      } catch (error) {
        console.error("Error fetching tryout data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="mx-auto p-6 rounded">
      <h2 className="text-lg font-bold mb-4 text-gray-800">TRYOUT SISWA</h2>
      <div className="p-4">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-300 px-4 py-2">NO.</th>
              <th className="border border-gray-300 px-4 py-2">Nama Paket</th>
              <th className="border border-gray-300 px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  Tidak ada data tryout.
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr key={item.id} className="text-center">
                  <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                  <td className="border border-gray-300 px-4 py-2">{item.nama_paket}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      onClick={() =>
                        navigate(`/dashboard/student/tryout/detailtryout/${item.id}`, {
                          
                        })
                      }
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Tryout;
