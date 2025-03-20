"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UrlFormData, UrlSchema } from "@/lib/type";
import { shortenUrl } from "@/server/actions/urls/shorten-url";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Copy } from "lucide-react";

import { useForm } from "react-hook-form";

const URLShortenForm = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [shortCode, setShortCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(false);

  const form = useForm<UrlFormData>({
    resolver: zodResolver(UrlSchema),
    defaultValues: {
      url: "",
    },
  });

  const onSubmit = async (data: UrlFormData) => {
    setLoading(true);
    setError(null);
    setShortUrl(null);
    setShortCode(null);

    try {
      const formData = new FormData();
      formData.append("url", data.url);

      const response = await shortenUrl(formData);
      if (response.success && response.data) {
        setShortUrl(response.data.shortUrl);
        //Extract the short code from the short URL
        const shortCodeMatch = response.data.shortUrl.match(/\/r\/([^/])$/);
        if (shortCodeMatch && shortCodeMatch[1]) {
          setShortCode(shortCodeMatch[1]);
        }
      }
    } catch (error) {
      setError("An error occurred while shortening the URL");
      console.error(error);
    }
  };

  const copyToClipboard = async () => {
    if (!shortUrl) return;
    try {
      await navigator.clipboard.writeText(shortUrl);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="w-full max-w-2xl mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        placeholder="Paste your long URL here"
                        {...field}
                        disabled={false}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="mr-2 size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Shortening...
                  </>
                ) : (
                  "Shorten"
                )}
                Shorten
              </Button>
            </div>

            {error && (
              <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
                {error}
              </div>
            )}

            {shortUrl && (
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Your shortened URL is{" "}
                  </p>
                  <div className="flex items-center gap-2">
                    <Input
                      type="text"
                      value={shortUrl}
                      readOnly
                      className="font-medium"
                    />
                    <Button
                      type="button"
                      variant={"outline"}
                      className="flex-shrink-0"
                      onClick={copyToClipboard}
                    >
                      <Copy className="size-4 mr-1" />
                      Copy
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </form>
        </Form>
      </div>
    </>
  );
};

export default URLShortenForm;
