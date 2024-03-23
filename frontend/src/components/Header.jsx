import { Link } from "react-router-dom";

export default function Header() {
    return (
        <Link
            className="absolute top-5 left-5 z-50 cursor-pointer"
            to={`/`}
            style={{ textDecoration: "none" }}
        >
            <h1 className="float-left font-bold bg-white p-2 px-4 rounded-md text-3xl text-black">
                US BGP Dashboard
            </h1>
        </Link>
    );
}
