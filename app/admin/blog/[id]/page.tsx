"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import BlogForm from "@/components/admin/BlogForm";

export default function EditBlogPage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/blog/${id}`).then(r => r.json()).then(d => setPost({ ...d, tags: (d.tags || []).join(", ") }));
  }, [id]);

  if (!post) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-nova-red border-t-transparent rounded-full animate-spin" /></div>;

  return <div><h1 className="text-white text-xl font-bold mb-6">Modifier : {post.title}</h1><BlogForm initialData={post} postId={id} /></div>;
}
