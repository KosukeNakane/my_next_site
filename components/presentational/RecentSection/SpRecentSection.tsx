import Link from "next/link";

const NewsItem = ({
  title,
  date,
  category,
  href,
}: {
  title: string;
  date: string;
  category?: string;
  href: string;
}) => {
  return (
    <li className="border-b pb-3">
      <Link href={href} className="block hover:opacity-85 transition">
        <h3 className="text-base font-semibold mb-1">{title}</h3>
        <p className="text-xs text-gray-600">
          {date}
          {category && (
            <span className="inline-block bg-gray-200 text-gray-800 text-[10px] font-bold px-2 py-0.5 ml-2">
              {category}
            </span>
          )}
        </p>
      </Link>
    </li>
  );
};

const SpRecentSection = () => {
  return (
    <section className="w-full bg-white py-8 px-4">
      <div className="max-w-[1200px] mx-auto">
        <h2 className="text-xl font-bold mb-4">Recent Updates</h2>
        <ul className="space-y-4">
          <NewsItem
            title="FOOD コレクションを公開"
            date="2025-08-30"
            category="FOOD"
            href="/food"
          />
          <NewsItem
            title="TOKYO / YOKOHAMA フォトギャラリー"
            date="2025-08-24"
            category="TOKYO / YOKOHAMA"
            href="/tokyo-yokohama"
          />
          <NewsItem
            title="HIMEJI の風景を追加"
            date="2025-08-21"
            category="HIMEJI"
            href="/himeji"
          />
        </ul>
      </div>
    </section>
  );
};

export default SpRecentSection;

