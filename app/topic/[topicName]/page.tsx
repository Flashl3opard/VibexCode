import connectDB from "@/lib/mongodb";
import { notFound } from "next/navigation";
import Category from "@/models/Categories _temp";

interface TopicPageProps {
  params: {
    topicName: string;
  };
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { topicName } = params;

  await connectDB();

  const topic = await Category.findOne({ name: decodeURIComponent(topicName) });

  if (!topic) return notFound();

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">{topic.name}</h1>
      <p className="mb-2">Progress: {topic.progress}%</p>

      <div className="space-y-2">
        {topic.questions.map((q: string, i: number) => (
          <div
            key={i}
            className="p-3 bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 rounded-xl shadow text-sm"
          >
            {i + 1}. {q}
          </div>
        ))}
      </div>
    </div>
  );
}
