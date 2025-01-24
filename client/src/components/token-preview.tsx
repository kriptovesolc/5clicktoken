import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TokenPreviewProps {
  open: boolean;
  onClose: () => void;
  data: {
    name: string;
    symbol: string;
    decimals: number;
    totalSupply: number;
    description: string;
    imageUrl?: string;
  };
}

export default function TokenPreview({ open, onClose, data }: TokenPreviewProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Token Preview</DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <AspectRatio ratio={1}>
            <img
              src={data.imageUrl || "https://via.placeholder.com/400"}
              alt={data.name}
              className="rounded-lg object-cover w-full h-full"
            />
          </AspectRatio>

          <ScrollArea className="h-[200px] mt-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Name</h3>
                <p>{data.name}</p>
              </div>

              <div>
                <h3 className="font-semibold">Symbol</h3>
                <p>{data.symbol}</p>
              </div>

              <div>
                <h3 className="font-semibold">Decimals</h3>
                <p>{data.decimals}</p>
              </div>

              <div>
                <h3 className="font-semibold">Total Supply</h3>
                <p>{data.totalSupply.toLocaleString()}</p>
              </div>

              <div>
                <h3 className="font-semibold">Description</h3>
                <p className="whitespace-pre-wrap">{data.description}</p>
              </div>
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}