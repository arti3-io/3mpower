import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function Sort({ setSort }: { setSort: (sort: string) => void }) {
  const handleSortChange = (sort: string) => {
    setSort(sort);
  };

  return (
    <Select defaultValue="top" onValueChange={handleSortChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="top">Members high to low</SelectItem>
        <SelectItem value="recent">Recently Added</SelectItem>
      </SelectContent>
    </Select>
  );
}
