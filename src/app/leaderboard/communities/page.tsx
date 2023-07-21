import { Payment, columns } from "./columns";
import { DataTable } from "./data-table";
async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    {
      rank: 1,
      id: "mazkgang",
      name: "Mazk Gang",
      profile_url:
        "https://i.seadn.io/gcs/files/9a3eca819213540351ae773d384d4383.gif?auto=format&dpr=1&w=256",
      engagement: 1,
      reach: 16,
      members: 16,
    },
    {
      rank: 2,
      id: "0N1Force",
      name: "0N1 Force",
      profile_url:
        "https://i.seadn.io/gae/7gOej3SUvqALR-qkqL_ApAt97SpUKQOZQe88p8jPjeiDDcqITesbAdsLcWlsIg8oh7SRrTpUPfPlm12lb4xDahgP2h32pQQYCsuOM_s?auto=format&dpr=1&w=256",
      engagement: 2,
      reach: 13,
      members: 12,
    },
    {
      rank: 3,
      id: "y00ts",
      name: "y00ts",
      profile_url:
        "https://i.seadn.io/gcs/files/ce85ffa4aab75e4024e70f18160bbf9f.png?auto=format&dpr=1&w=256",
      engagement: 13,
      reach: 14,
      members: 11,
    },
  ];
}
export default async function Index() {
  const data = await getData();
  return (
    <div className="min-w:h-screen flex flex-col lg:px-40 px-8 py-4 gap-24">
      <div className="flex flex-col">
        <div className="w-full flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex gap-4 items-center">
            <h1 className="text-xl md:text-3xl font-extrabold">
              Community Rankings
            </h1>
            <p className="text-gray-400">{data.length}</p>
          </div>
        </div>
        <div className="py-10">
          <DataTable columns={columns} data={data} />
        </div>
      </div>
    </div>
  );
}
