import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { createToken, type TokenDetails } from "@/lib/token";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Eye, Upload, Link } from "lucide-react";
import TokenPreview from "./token-preview";

const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const tokenSchema = z.object({
  name: z.string().min(1, "Name is required").max(32, "Name must be less than 32 characters"),
  symbol: z.string().min(1, "Symbol is required").max(10, "Symbol must be less than 10 characters"),
  decimals: z.number().min(0).max(9),
  totalSupply: z.number().positive("Supply must be positive"),
  description: z.string().optional(),
  imageUrl: z.string().url("Please enter a valid URL").optional(),
  image: z
    .any()
    .refine((file) => !file || (file instanceof File && file.size <= MAX_FILE_SIZE), {
      message: "Image must be less than 5MB",
    })
    .refine((file) => !file || (file instanceof File && ACCEPTED_IMAGE_TYPES.includes(file.type)), {
      message: "Only .jpg, .jpeg, .png and .webp formats are supported",
    })
    .optional(),
});

type TokenFormValues = z.infer<typeof tokenSchema>;

interface TokenFormProps {
  connected: boolean;
}

export default function TokenForm({ connected }: TokenFormProps) {
  const { toast } = useToast();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>();
  const [useImageUrl, setUseImageUrl] = useState(false);

  const form = useForm<TokenFormValues>({
    resolver: zodResolver(tokenSchema),
    defaultValues: {
      decimals: 9,
      totalSupply: 1000000,
      description: "",
      imageUrl: "",
    },
  });

  const createTokenMutation = useMutation({
    mutationFn: async (data: TokenDetails) => {
      if (!window.solana?.publicKey) {
        throw new Error("Wallet not connected");
      }
      return createToken(
        window.solana.connection,
        window.solana.publicKey,
        data
      );
    },
    onSuccess: (tokenAddress) => {
      toast({
        title: "Token Created!",
        description: `Your SPL token has been successfully created at address: ${tokenAddress}`,
      });
      form.reset();
      setImagePreview(undefined);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create token",
      });
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        form.setValue("imageUrl", ""); // Clear URL when file is selected
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(undefined);
    }
  };

  const handleImageUrlChange = (url: string) => {
    if (url) {
      setImagePreview(url);
      form.setValue("image", undefined); // Clear file when URL is entered
    } else {
      setImagePreview(undefined);
    }
  };

  const onSubmit = async (data: TokenFormValues) => {
    if (!connected) {
      toast({
        variant: "destructive",
        title: "Wallet Not Connected",
        description: "Please connect your wallet to create a token.",
      });
      return;
    }

    try {
      await createTokenMutation.mutateAsync({
        ...data,
        imageUrl: imagePreview,
      });
    } catch (error) {
      // Error is handled by mutation
    }
  };

  return (
    <div className={`transition-opacity duration-200 ${connected ? 'opacity-100' : 'opacity-70'}`}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Token Name</FormLabel>
                <FormControl>
                  <Input placeholder="My Token" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="symbol"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Symbol</FormLabel>
                <FormControl>
                  <Input placeholder="MTK" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="decimals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Decimals</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      {...field}
                      onChange={e => field.onChange(parseInt(e.target.value))} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="totalSupply"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Supply</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      {...field}
                      onChange={e => field.onChange(parseInt(e.target.value))} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="Enter token description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <FormLabel>Token Image</FormLabel>
              <div className="space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setUseImageUrl(false)}
                  className={!useImageUrl ? "bg-primary text-primary-foreground" : ""}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setUseImageUrl(true)}
                  className={useImageUrl ? "bg-primary text-primary-foreground" : ""}
                >
                  <Link className="h-4 w-4 mr-2" />
                  URL
                </Button>
              </div>
            </div>

            {useImageUrl ? (
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Enter image URL"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          handleImageUrlChange(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <FormField
                control={form.control}
                name="image"
                render={({ field: { onChange, value, ...field } }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="file"
                        accept={ACCEPTED_IMAGE_TYPES.join(",")}
                        onChange={(e) => {
                          onChange(e.target.files?.[0]);
                          handleImageChange(e);
                        }}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {imagePreview && (
              <AspectRatio ratio={1} className="overflow-hidden rounded-lg">
                <img
                  src={imagePreview}
                  alt="Token preview"
                  className="object-cover w-full h-full"
                />
              </AspectRatio>
            )}
          </div>

          <div className="flex gap-4">
            <Button 
              type="submit"
              disabled={!connected || createTokenMutation.isPending}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white"
            >
              {createTokenMutation.isPending ? "Creating..." : "Create Token"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => setPreviewOpen(true)}
              disabled={!form.getValues("name")}
              className="px-3"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </Form>

      <TokenPreview
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        data={{
          name: form.getValues("name") || "",
          symbol: form.getValues("symbol") || "",
          decimals: form.getValues("decimals") || 0,
          totalSupply: form.getValues("totalSupply") || 0,
          description: form.getValues("description") || "",
          imageUrl: imagePreview,
        }}
      />
    </div>
  );
}