import { useState } from 'react'

const App = () => {
  const [image, setImage] = useState(null)
  const [value, setValue] = useState('')
  const [response, setResponse] = useState('')
  const [error, setError] = useState('')
  const surpriseOptions = [
    'Does the image have a whale?',
    'Is the image fabulously pink?',
    'Does the image have puppies?'
  ]

  const surprise = () => {
    const randomValue = surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)]
    setValue(randomValue)
  }

  console.log(value)

  const analyzeImage = async() => { 
    setResponse("")
    if (!image) {
      setError('Error! Must have an existing image!')
      return
    }
    try {
      const options = {
        method: 'POST',
        body: JSON.stringify({
          message: value
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }
      const response = await fetch("http://localhost:8000/openai", options)
      const text = await response.text()
      setResponse(text)
    } catch (err) {
      console.log(err)
      setError("Something didn't work. Please try again.")
    }
  }
  
  const clear = () => {
    setImage(null)
    setValue('')
    setResponse('')
    setError('')
  }

  const uploadImage = async(e) => {
    const formData = new FormData()
    formData.append('file', e.target.files[0])
    setImage(e.target.files[0])
    e.target.null = null
    try {
      const options = {
        method: 'POST',
        body: formData
      }
      const response = await fetch('http://localhost:8000/upload', options)
      const data = await response.json()
      console.log(data)
    } catch (err) {
      console.log(err)
      setError("Something didn't work. Please try again.")
    }
  }

  return (
    <div className="app">
      <section className="search-section">
      <div className="image-container">
          {image && <img src={URL.createObjectURL(image)}></img>}
          </div>
          <p className="extra-info">
            <span>
              <label htmlFor="file">upload an image </label>
            <input onChange={uploadImage} id="file" accept="image/*" type="file" hidden />
            to ask questions about
            </span>
          </p>
          <p>What do you want to know about the image?
            <button className="surprise" onClick={surprise} disabled={response}>Surpise me</button>
          </p>

          <div className="input-container">
            <input
              value={value}
              placeholder="What is in the image..."
              onChange={(e) => setValue(e.target.value)}
            />
            {(!response && !error) && <button onClick={analyzeImage}>Ask me</button>}
            {(response || error) && <button onClick={clear}>Clear</button>}
          </div>
          {error && <p>{error}</p>}
          {response && <p className="answer">{response}</p>}
      </section>
    </div>
  )
}

export default App
