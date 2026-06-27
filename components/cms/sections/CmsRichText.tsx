import { RichTextProps } from "@/lib/types/page-builder";

export default function CmsRichText({ props }: { props: RichTextProps }) {
  const { content = "" } = props;
  if (!content) return null;

  return (
    <section className="py-12 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="prose prose-gray max-w-none prose-headings:font-black prose-headings:text-gray-900 prose-a:text-nova-red prose-strong:text-gray-800"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </section>
  );
}
