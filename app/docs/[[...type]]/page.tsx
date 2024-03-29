export default function Docs({params}: {
    params: {
        type: string[];
    };
}) {
    if(params.type?.length === 2) {
        return <h1>
            Viewind docs for feature {params.type[0]} and version {params.type[1]}
        </h1>
    } else if(params.type?.length === 1) {
        return <h1>
            Viewind docs for feature {params.type[0]}
        </h1>
    }
    return <h1>Docs</h1>;
    }
    