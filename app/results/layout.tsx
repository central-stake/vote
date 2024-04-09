import { ReactNode } from "react";

export default async function ResultsLayout({ children } : { children: ReactNode}) {

  return (
    <div className="flex flex-col space-y-6 mt-10 mb-40">
      <div className="container">
        <header className="text-center flex flex-col items-center justify-center mb-14 pt-4">
          <h1 className="font-bold text-3xl md:text-4xl max-w-lg">
            Results
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean porta risus non nunc ornare.
          </p>
        </header>

        <main className="pt-10">
          {children}
        </main>
      </div>
    </div>
  );
}