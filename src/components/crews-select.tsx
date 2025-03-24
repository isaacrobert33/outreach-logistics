import { Control, Controller } from "react-hook-form";
import { Label } from "./ui/label";
import { Select } from "@radix-ui/react-select";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const CrewSelect = ({
  label,
  control,
}: {
  label?: string;
  control: Control<any>;
}) => {
  return (
    <div className="flex flex-col gap-4">
      <Label htmlFor="new-crew" className="text-right">
        {label || "Crew"}
      </Label>
      <Controller
        name={"crew"}
        control={control}
        defaultValue="nocrew"
        rules={{ required: "Crew is required" }}
        render={({ field }) => (
          <Select
            value={field.value}
            onValueChange={(value) => field.onChange(value)}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select crew" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nocrew">No Crew</SelectItem>
              <SelectItem value="kitchen">Kitchen Crew</SelectItem>
              <SelectItem value="technical">Technical Crew</SelectItem>
              <SelectItem value="logistics">Logistics Crew</SelectItem>
              <SelectItem value="medical">Medical Crew</SelectItem>
              <SelectItem value="sanitation">Sanitation Crew</SelectItem>
              <SelectItem value="security">Security Crew</SelectItem>
               <SelectItem value="ushering">Ushering Crew</SelectItem>
            </SelectContent>
          </Select>
        )}
      />
    </div>
  );
};

export default CrewSelect;
