import PageNav from "../components/PageNav";
import Complement from "../components/Complement";

export default function ListComplement() {
    return (
        <>
            <PageNav
                titleHref="/dashboard"
                centerTitle
                buttons={[{ label: "Back", href: "/listSales" }]}
            />
            <div className="report-bg" style={{ position: "relative", zIndex: -1 }}></div>
            <div>
                <br />
                <Complement />
            </div>
        </>
    );
}
