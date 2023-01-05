import { useState } from "react"
import Loader from "../components/Loader"
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage"
import { getAuth } from "firebase/auth"

const ImageUploader = () => {
  const [upload, setUpload] = useState(false)
  const [progress, setProgress] = useState(0)
  const [downloadUrl, setDownloadUrl] = useState(null)

  const uploadFile = (e) => {
    const file = Array.from(e.target.files)[0]
    const extension = file.type.split("/")[1]

    const storage = getStorage()
    const storageRef = ref(
      storage,
      `uploads/${getAuth().currentUser.uid}/${Date.now()}.${extension}`
    )

    setUpload(true)

    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progressCal =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setProgress(progressCal)
      },
      () => {},
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setDownloadUrl(downloadURL)
          setUpload(false)
        })
      }
    )
  }

  return (
    <div className="box">
      <Loader show={upload} />
      {upload && <h3>{progress}%</h3>}
      {!upload && (
        <>
          <label className="btn">
            upload image
            <input
              type="file"
              onChange={uploadFile}
              accept="image/x-png,image/gif,image/jpeg"
            />
          </label>
          {downloadUrl && (
            <code className="upload-snippet">{`![alt](${downloadUrl})`}</code>
          )}
        </>
      )}
    </div>
  )
}

export default ImageUploader
