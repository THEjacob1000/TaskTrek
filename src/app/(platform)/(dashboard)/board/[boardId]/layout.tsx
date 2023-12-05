import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { notFound, redirect } from "next/navigation";
import BoardNavbar from "./_components/BoardNavbar";

export async function generateMetadata({
  params,
}: {
  params: { boardId: string };
}) {
  const { orgId } = auth();
  if (!orgId) return { title: "Board" };
  const board = await db.board.findUnique({
    where: {
      id: params.boardId,
      orgId,
    },
  });
  return {
    title: board?.title || "Board",
  };
}

const Layout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { boardId: string };
}) => {
  const { orgId } = auth();
  if (!orgId) return redirect("/select-org");

  const board = await db.board.findUnique({
    where: {
      id: params.boardId,
      orgId,
    },
  });
  if (!board) {
    notFound();
  }

  return (
    <div
      className="relative min-h-screen bg-no-repeat bg-cover bg-center"
      style={{ backgroundImage: `url(${board.imageFullUrl})` }}
    >
      <BoardNavbar data={board} />
      <div className="absoulute inset-0 bg-black/10" />
      <main className="relative pt-28 h-full">{children}</main>
    </div>
  );
};

export default Layout;
