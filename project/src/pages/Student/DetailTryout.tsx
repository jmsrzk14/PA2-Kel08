import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

const DetailTryout = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState<{ jenis: string; nilai: number }[]>([]);
  const [rataRata, setRataRata] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [idUsers, setIdUsers] = useState('');
  const [namaUsers, setNamaUsers] = useState('');
  const [nisn, setNisn] = useState('');
  const [idSekolah, setIdSekolah] = useState('');
  const [namaSekolah, setNamaSekolah] = useState('');
  const [noUtbk, setNoUtbk] = useState('');
  const [kelompokUjian, setKelompokUjian] = useState('');
  const [namaPaket, setNamaPaket] = useState('');
  const [foto, setFoto] = useState('');

  const generatePDF = async () => {
    try {
      const res = await fetch('/template.pdf');
      if (!res.ok) throw new Error('Gagal memuat template PDF');
      const existingPdfBytes = await res.arrayBuffer();
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];

      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const drawText = (text: string | number, x: number, y: number) => {
        firstPage.drawText(String(text), {
          x,
          y,
          size: 17,
          font,
          color: rgb(0, 0, 0)
        });
      };

      const scoreText = (text: string | number, x: number, y: number) => {
        firstPage.drawText(String(text), {
          x,
          y,
          size: 12,
          font,
          color: rgb(0, 0, 0)
        });
      };

      drawText(namaUsers, 320, 400.5);
      drawText(nisn, 320, 371);
      drawText(namaSekolah, 320, 342.5);
      drawText(noUtbk, 320, 314);
      drawText(kelompokUjian, 320, 285.5);
      drawText(namaPaket, 415, 240);

      const nilaiMap = Object.fromEntries(data.map(d => [d.jenis, d.nilai]));
      scoreText(`${nilaiMap["Penalaran Umum"]}`, 675, 178);
      scoreText(`${nilaiMap["Pengetahuan & Pemahaman Umum"]}`, 675, 156);
      scoreText(`${nilaiMap["Pemahaman Bacaan & Menulis"]}`, 675, 131);
      scoreText(`${nilaiMap["Pengetahuan Kuantitatif"]}`, 675, 108.5);
      scoreText(`${nilaiMap["Literasi Bahasa Indonesia"]}`, 675, 83.5);
      scoreText(`${nilaiMap["Literasi Bahasa Inggris"]}`, 675, 61);
      scoreText(`${nilaiMap["Penalaran Matematika"]}`, 675, 35.6);

      const imagePath = `http://160.19.166.155:8000/${foto}`;
      const imageRes = await fetch(imagePath);
      
      if (!imageRes.ok) throw new Error('Gagal mengunduh gambar');

      const imageArrayBuffer = await imageRes.arrayBuffer();
      
      if (!imageArrayBuffer || imageArrayBuffer.byteLength === 0) {
        throw new Error('Gambar yang diunduh rusak atau kosong');
      }

      const image = await pdfDoc.embedJpg(imageArrayBuffer);
      const imageWidth = 100; 
      const imageHeight = 130;

      firstPage.drawImage(image, {
        x: 665,
        y: 410.5 - imageHeight,
        width: imageWidth,
        height: imageHeight
      });


      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `Sertifikat_Tryout_${namaUsers}.pdf`;
      link.click();
    } catch (error) {
      console.error('Gagal membuat PDF:', error);
      setError('Gagal membuat sertifikat.');
    }
  };


  useEffect(() => {
    const fetchAdmin = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get(`http://160.19.166.155:8000/student/profile`, {
          withCredentials: true,
        });

        const data = response.data;
        setIdUsers(data.data.id);
        setNamaUsers(data.data.first_name);
        setNisn(data.data.nisn);
        setIdSekolah(data.data.asal_sekolah);
        setNoUtbk(data.data.no_utbk);
        setKelompokUjian(data.data.kelompok_ujian)
        setFoto(data.data.foto)
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
    const fetchSekolah = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get(`http://160.19.166.155:8000/admin/viewSekolah/${idSekolah}`);
        const data = response.data;
        setNamaSekolah(data.sekolah);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError('Gagal memuat data. Silakan coba lagi.');
      } finally {
        setLoading(false);
      }
    };

    if (idSekolah) {
      fetchSekolah();
    }
  }, [idSekolah]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const paymentRes = await fetch(`http://160.19.166.155:8000/admin/viewPaymentCourses/${id}`);
        const paymentNameRes = await fetch(`http://160.19.166.155:8000/admin/viewPayment/${id}`);
        const paymentData = await paymentRes.json();
        const paymentNameData = await paymentNameRes.json();

        const idPacket = paymentData.id_paket;
        const tahun = new Date().getFullYear().toString();
        setNamaPaket(paymentNameData.id_paket);

        const res = await fetch(`http://160.19.166.155:8000/admin/viewScoreDetail/${tahun}/${idUsers}/${idPacket}`);
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
      <div className="flex justify-between ml-4 mr-4">
        <h2 className="text-lg font-bold mb-4 text-gray-800">Detail Nilai {namaPaket}</h2>
        <button
          className="ml-4 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
          onClick={generatePDF}
        >
          Unduh Sertifikat
        </button>
      </div>

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