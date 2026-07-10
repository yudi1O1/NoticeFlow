import Head from "next/head";

export function Layout({ children }) {
  return (
    <>
      <Head>
        <title>NoticeFlow | Notice Board</title>
        <meta
          content="Create, edit, prioritize, and manage institution notices."
          name="description"
        />
      </Head>
      <main className="min-h-screen px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </>
  );
}
