// src/pages/seats.jsx

const Seats = () => {
  const seatData = [
    {
      program: 'B.Tech',
      total: 1500,
      counseling: 1275,
      direct: 225,
    },
    {
      program: 'MCA',
      total: 180,
      counseling: 153,
      direct: 27,
    },
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-indigo-700">ABES Engineering College - Seat Availability</h1>

      <table className="w-full border-collapse border border-gray-300 shadow-lg">
        <thead className="bg-indigo-100 text-indigo-800">
          <tr>
            <th className="p-4 border border-gray-300 text-left">Program</th>
            <th className="p-4 border border-gray-300 text-left">Total Seats</th>
            <th className="p-4 border border-gray-300 text-left">Counseling Seats (85%)</th>
            <th className="p-4 border border-gray-300 text-left">Direct Seats (15%)</th>
          </tr>
        </thead>
        <tbody>
          {seatData.map((row, index) => (
            <tr key={index} className="even:bg-gray-50 hover:bg-gray-100">
              <td className="p-4 border border-gray-300">{row.program}</td>
              <td className="p-4 border border-gray-300">{row.total}</td>
              <td className="p-4 border border-gray-300">{row.counseling}</td>
              <td className="p-4 border border-gray-300">{row.direct}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 text-yellow-800 rounded-md">
        <p><strong>Note:</strong> 85% of seats are filled via JEE Main / CUET (counseling), and 15% via direct institute-level admission.</p>
      </div>
    </div>
  );
};

export default Seats;
