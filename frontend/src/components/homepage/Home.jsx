function Home() {
  return (
    <div className="welcom-container">
      <h1>Welcome</h1>

      <h5>
        <br />
        This is my personal project that I created for study purposes.
      </h5>
      <p>
        To log in to the default account, use the email
        "default@leitnercards.com". The password consists of the first 4 letters
        of the alphabet (the first letter capitalized), the first 4 digits
        (starting from 1), and a period at the end.
      </p>
      <p>
        This web app for flashcards based on the Leitner system is an
        interactive study tool that helps users efficiently memorize information
        through spaced repetition. The app organizes flashcards into multiple
        levels or boxes. Correctly answered cards move to a higher level, where
        they are reviewed less frequently, while incorrectly answered cards
        return to the first level for more frequent review. This method enhances
        long-term retention by focusing more on difficult cards and gradually
        reducing review of easier ones.
      </p>

      <img
        src="https://upload.wikimedia.org/wikipedia/commons/a/ae/Leitner_system_animation.gif"
        className="welcomeGif"
        alt="gif"
      />
    </div>
  );
}
export default Home;
