import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page py-20 text-center">
      <h1 className="text-3xl font-semibold">找不到這個頁面</h1>
      <p className="mt-2 text-sm text-muted">連結可能已失效,或你查的梗圖不在資料庫中。</p>
      <Link href="/" className="btn-primary mt-6 inline-flex">回首頁</Link>
    </div>
  );
}
