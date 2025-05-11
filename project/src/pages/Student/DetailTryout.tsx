import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';

const DetailTryout = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState<{ jenis: string; nilai: number }[]>([]);
  const [rataRata, setRataRata] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [idUsers, setIdUsers] = useState('');
  const [namaUsers, setNamaUsers] = useState('');
  const [namaPaket, setNamaPaket] = useState('');

  useEffect(() => {
    const fetchAdmin = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get(`http://localhost:8000/student/profile`, {
          withCredentials: true,
        });

        const data = response.data;
        setIdUsers(data.data.id);
        setNamaUsers(data.data.first_name);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError('Gagal memuat data. Silakan coba lagi.');
      } finally {
        setLoading(false);
      }
    };
    fetchAdmin();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const paymentRes = await fetch(`http://localhost:8000/admin/viewPaymentCourses/${id}`);
        const paymentNameRes = await fetch(`http://localhost:8000/admin/viewPayment/${id}`);
        const paymentData = await paymentRes.json();
        const paymentNameData = await paymentNameRes.json();

        const idPacket = paymentData.id_paket;
        const tahun = new Date().getFullYear().toString();
        setNamaPaket(paymentNameData.id_paket);

        const res = await fetch(`http://localhost:8000/admin/viewScoreDetail/${tahun}/${idUsers}/${idPacket}`);
        const json = await res.json();

        if (!Array.isArray(json) || json.length === 0) {
          throw new Error("Data nilai tidak ditemukan.");
        }

        const nilaiObj = json[0];

        const jenisMap = [
          { key: "pu", label: "Penalaran Umum" },
          { key: "ppu", label: "Pengetahuan & Pemahaman Umum" },
          { key: "pbm", label: "Pemahaman Bacaan & Menulis" },
          { key: "pk", label: "Pengetahuan Kuantitatif" },
          { key: "lbi", label: "Literasi Bahasa Indonesia" },
          { key: "lbe", label: "Literasi Bahasa Inggris" },
          { key: "pm", label: "Penalaran Matematika" },
        ];

        const nilaiArray = jenisMap.map(item => ({
          jenis: item.label,
          nilai: nilaiObj[item.key] || 0
        }));

        setData(nilaiArray);
        setRataRata(nilaiObj.total || 0);
      } catch (error) {
        console.error("Gagal mengambil detail tryout:", error);
        setError("");
      }
    };

    if (id && idUsers) {
      fetchData();
    }
  }, [id, idUsers]);

  return (
    <div className="mx-auto p-6 rounded">
      <h2 className="text-lg font-bold mb-4 text-gray-800">Detail Nilai {namaPaket}</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="p-4">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-300 px-4 py-2">NO.</th>
              <th className="border border-gray-300 px-4 py-2">Jenis</th>
              <th className="border border-gray-300 px-4 py-2">Nilai</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="text-center">
                <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                <td className="border border-gray-300 px-4 py-2">{item.jenis}</td>
                <td className="border border-gray-300 px-4 py-2">{item.nilai}</td>
              </tr>
            ))}
            <tr className="font-bold bg-gray-100 text-center">
              <td className="border border-gray-300 px-4 py-2" colSpan={2}>Rata-rata</td>
              <td className="border border-gray-300 px-4 py-2">{rataRata}</td>
            </tr>
          </tbody>
        </table>

        <div className="flex justify-end mt-4">
          <button
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => navigate("/dashboard/student/tryout")}
          >
            Kembali
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailTryout;