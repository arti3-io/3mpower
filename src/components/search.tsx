import { Input } from '@/components/ui/input';

export function Search({ setSearch }: { setSearch: (search: string) => void }) {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };
  return (
    <div>
      <Input
        type="search"
        placeholder="Search..."
        className="md:w-[100px] lg:w-[300px]"
        onChange={handleSearch}
      />
    </div>
  );
}
