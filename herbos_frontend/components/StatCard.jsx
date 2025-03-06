const StatCard = ({ icon, title, value }) => {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md flex flex-col md:flex-row items-center text-center md:text-left">
        <div className="bg-blue-100 p-3 rounded-full mb-3 md:mb-0 md:mr-4">
          {icon}
        </div>
        <div>
          <p className="text-gray-500">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    );
  };
  
  export default StatCard;
  