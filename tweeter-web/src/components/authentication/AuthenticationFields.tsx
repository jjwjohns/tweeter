interface Props {
    function_auth: (event: React.KeyboardEvent<HTMLElement>) => void;
    setAlias: (alias: string) => void;
    setPassword: (password: string) => void;
}

const AuthenticationFields = ({ function_auth, setAlias, setPassword }: Props) => {

    return (
        <>
            <div className="form-floating">
            <input
                type="text"
                className="form-control"
                size={50}
                id="aliasInput"
                placeholder="name@example.com"
                onKeyDown={function_auth}
                onChange={(event) => setAlias(event.target.value)}
            />
            <label htmlFor="aliasInput">Alias</label>
            </div>
            <div className="form-floating">
            <input
                type="password"
                className="form-control bottom"
                id="passwordInput"
                placeholder="Password"
                onKeyDown={function_auth}
                onChange={(event) => setPassword(event.target.value)}
            />
            <label htmlFor="passwordInput">Password</label>
            </div>
        </>
    )
}

export default AuthenticationFields;