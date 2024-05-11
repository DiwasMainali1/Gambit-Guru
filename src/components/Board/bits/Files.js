const Files = ({files}) => {
    return <div className="files">
        {files.map(file => <span>{file}</span>)}
    </div>
}

export default Files