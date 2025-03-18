import URLShortenForm from "./components/urls/URLShortenForm";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col justify-center items-center p-6 md:p-24">
      <div className="w-full max-w-3xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Shorten Your Links
        </h1>
        <p
          className="text-lg text-muted-foreground mb-8
         max-w-2xl mx-auto"
        >{`Paste your long URL and get a shortened link. It's free and easy to use.`}</p>
        <URLShortenForm />
      </div>
    </div>
  );
}
