const Skeleton = () => {
  return (
    <table className=" skeleton w-full overflow-y-auto text-left text-sm text-blue-100 rtl:text-right dark:text-blue-100">
      <thead className="border-b  border-blue-400 bg-blue-600 text-xs uppercase text-white dark:text-white">
        <tr>
          <th className="w-4 p-4 ">
            <div className="skeleton h-6 w-full"></div>
          </th>
          <th className="w-4 px-6 py-3">
            <div className="skeleton h-6 w-full"></div>
          </th>
          <th className="w-4 px-6 py-3">
            <div className="skeleton h-6 w-full"></div>
          </th>
          <th className="w-4 px-6 py-3">
            <div className="skeleton h-6 w-full"></div>
          </th>
          <th className="w-4 px-6 py-3">
            <div className="skeleton h-6 w-full"></div>
          </th>
          <th className="w-4 px-6 py-3">
            <div className="skeleton h-6 w-full"></div>
          </th>
          <th className="w-4 px-6 py-3">
            <div className="skeleton h-6 w-full"></div>
          </th>
          <th className="w-4 px-6 py-3">
            <div className="skeleton h-6 w-full"></div>
          </th>
          <th className="w-4 px-6 py-3">
            <div className="skeleton h-6 w-full"></div>
          </th>
          <th className="w-4 px-6 py-3">
            <div className="skeleton h-6 w-full"></div>
          </th>
        </tr>
      </thead>
      <tbody>
        {new Array(10).fill(10).map((e, i) => (
          <tr
            key={String(e + i)}
            className="border-b h-[10vh] border-blue-400 bg-blue-600 hover:bg-blue-500"
          >
            <td className="w-4 ">
              <div className="skeleton h-6 w-full"></div>
            </td>
            <td className="w-4">
              <div className="skeleton h-6 w-full"></div>
            </td>
            <td className="w-4">
              <div className="skeleton h-6 w-full"></div>
            </td>
            <td className="w-4">
              <div className="skeleton h-6 w-full"></div>
            </td>
            <td className="w-4">
              <div className="skeleton h-6 w-full"></div>
            </td>
            <td className="w-4">
              <div className="skeleton h-6 w-full"></div>
            </td>
            <td className="w-4">
              <div className="skeleton h-6 w-full"></div>
            </td>
            <td className="w-4">
              <div className="skeleton h-6 w-full"></div>
            </td>
            <td className="w-4">
              <div className="skeleton h-6 w-full"></div>
            </td>
            <td className="w-4">
              <div className="skeleton h-6 w-full"></div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Skeleton;
