import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href="/">
      <div className="hover:opacity-75 transition items-center gap-x-2 hidden md:flex">
        <Image src="/logo.png" alt="logo" height={50} width={50} />
      </div>
    </Link>
  );
};

export default Logo;
