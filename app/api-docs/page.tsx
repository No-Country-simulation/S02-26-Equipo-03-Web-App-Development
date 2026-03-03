import { getApiDocs } from "@/shared/lib/swagger";
import ReactSwagger from "@/shared/components/swagger-ui";

export default async function IndexPage() {
  const spec = await getApiDocs();
  return (
    <main>
      <section className="container py-8">
        <ReactSwagger spec={spec} />
      </section>
    </main>
  );
}
