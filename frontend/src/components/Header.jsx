import { Link, useLocation } from "react-router-dom";

export default function Header() {
    return (
        <Link
            className="absolute top-5 left-5 z-50 cursor-pointer"
            to={`/`}
            style={{ textDecoration: "none" }}
        >
            <h1 className="float-left font-bold bg-white p-2 px-4 text-3xl text-black rounded-lg">
                US BGP Map
            </h1>
        </Link>
    );
}
