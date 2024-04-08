import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <section
      className="flex items-center justify-center bg-background min-h-[90vh]"
    >
      <div className="relative items-center w-full px-5 py-12 mx-auto lg:px-16 max-w-7xl md:px-12">
        <div className="max-w3-xl mx-auto text-center">
          <div>
            <span className="w-auto px-6 py-3 rounded-full bg-secondary">
              <span className="text-sm font-medium text-primary">
                Make the difference.
              </span>
            </span>

            <h1 className="mt-8 text-3xl font-extrabold tracking-tight lg:text-6xl">
              Make the vote great again
            </h1>
            <p className="max-w-xl mx-auto mt-8 text-base lg:text-xl text-secondary-foreground">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam felis nunc, gravida vel nisl eu, sollicitudin auctor nunc. Sed condimentum imperdiet tortor.
            </p>
          </div>

          <div className="flex justify-center max-w-sm mx-auto mt-10">
              <Button size="lg" className="w-full" asChild>
                <Link href="/vote">
                  Start voting now!
                </Link>
              </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
