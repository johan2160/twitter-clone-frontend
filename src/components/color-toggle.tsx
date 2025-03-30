import { Check, Palette } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useColors } from "@/components/colors-provider";

interface ThemeColor {
  name: string;
  value: string;
  background: string;
}

const themes: ThemeColor[] = [
  {
    name: "Pink",
    value: "pink",
    background: "oklch(46.76% 0.1426 316.59)",
  },
  {
    name: "Orange",
    value: "orange",
    background: "oklch(46.76% 0.1426 79.41)",
  },
  {
    name: "Blue",
    value: "blue",
    background: "oklch(46.76% 0.1426 271.06)",
  },
];

export function ColorToggle() {
  const { color, setColor } = useColors();

  return (
    <DropdownMenu>
      <DropdownMenuItem>
        <DropdownMenuTrigger asChild>
          <div className="w-full flex items-center gap-2 text-sm">
            <Palette className="h-4 w-4" />
            <span>Colors</span>
          </div>
        </DropdownMenuTrigger>
      </DropdownMenuItem>
      <DropdownMenuContent>
        {themes.map((theme) => (
          <DropdownMenuItem key={theme.value} onClick={() => setColor(theme.value as any)}>
            <div className="flex items-center gap-2">
              <div
                className="h-4 w-4 rounded-full"
                style={{ background: theme.background }}
              ></div>
              <span>{theme.name}</span>
              {color === theme.value && <Check className="h-4 w-4" />}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
