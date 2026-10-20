"use client";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  useRef,
  useState,
} from "react";


type Answer =
  | "yes"
  | "maybe"
  | "no"
  | null;


const MAP_URL =
  "https://www.google.com/maps/search/?api=1&query=Grimaldi+3860+Olavarria+Buenos+Aires";


export default function Home() {

  const [screen, setScreen] =
    useState(0);

  const [muted, setMuted] =
    useState(false);

  const [name, setName] =
    useState("");

  const [answer, setAnswer] =
    useState<Answer>(null);

  const [error, setError] =
    useState("");


  const sendingRef =
    useRef(false);

  const musicRef =
    useRef<HTMLAudioElement | null>(null);


  const playSfx = (
    file: string
  ) => {

    if (muted) {
      return;
    }

    try {

      const sound =
        new Audio(
          `/audio/${file}.mp3`
        );

      sound.volume = 0.62;

      sound
        .play()
        .catch(() => {});

    }
    catch {
      // Audio files will be added later.
    }

  };


  const startMusic = () => {

    const audio =
      musicRef.current;

    if (!audio) {
      return;
    }

    audio.volume = 0.25;

    audio
      .play()
      .catch(() => {});

  };


  const enterExperience = () => {

    startMusic();

    playSfx(
      "powerup"
    );

    setScreen(1);

  };


  const goNext = () => {

    playSfx(
      "whoosh"
    );

    setScreen(
      (current) =>
        Math.min(
          current + 1,
          6
        )
    );

  };


  const goBack = () => {

    playSfx(
      "click"
    );

    setScreen(
      (current) =>
        Math.max(
          current - 1,
          0
        )
    );

  };


  const toggleSound = () => {

    const newMuted =
      !muted;

    setMuted(
      newMuted
    );

    if (
      musicRef.current
    ) {

      musicRef.current.muted =
        newMuted;

    }

  };


  const confirm =
    async () => {

      if (
        !name.trim()
      ) {

        setError(
          "Escribi tu nombre."
        );

        return;

      }


      if (!answer) {

        setError(
          "Elegi una opcion."
        );

        return;

      }


      if (
        sendingRef.current
      ) {

        return;

      }


      sendingRef.current =
        true;


      setError("");


      try {

        const body =
          new URLSearchParams();


        body.append(
          "nombre",
          name.trim()
        );


        body.append(
          "respuesta",
          answer
        );


        const response =
          await fetch(
            "/api/rsvp",
            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/x-www-form-urlencoded;charset=UTF-8",
              },

              body,
            }
          );


        const data =
          await response
            .json()
            .catch(
              () => ({
                ok: false,
              })
            );


        if (
          !response.ok ||
          !data.ok
        ) {

          throw new Error(
            "SAVE_FAILED"
          );

        }


        playSfx(
          "success"
        );


        setScreen(6);

      }
      catch (error) {

        console.error(
          error
        );


        sendingRef.current =
          false;


        setError(
          "No se pudo guardar la respuesta. Intenta nuevamente."
        );

      }

    };


  return (

    <main className="experience">

      <audio
        ref={musicRef}
        src="/audio/musica.mp3"
        loop
        preload="auto"
      />


      <BackgroundEffects />


      {screen > 0 &&
        screen < 6 && (

          <button
            type="button"
            className="back-button"
            onClick={goBack}
            aria-label="Volver"
          >
            {"\u2190"}
          </button>

        )}


      {screen > 0 && (

        <button
          type="button"
          className="sound-button"
          onClick={
            toggleSound
          }
          aria-label="Sonido"
        >

          {muted
            ? "\uD83D\uDD07"
            : "\uD83D\uDD0A"}

        </button>

      )}


      <AnimatePresence
        mode="wait"
      >

        <motion.section
          key={screen}
          className={
            `screen screen-${screen}`
          }
          initial={{
            opacity: 0,
            scale: 0.86,
            filter:
              "blur(14px)",
          }}
          animate={{
            opacity: 1,
            scale: 1,
            filter:
              "blur(0px)",
          }}
          exit={{
            opacity: 0,
            scale: 1.12,
            filter:
              "blur(16px)",
          }}
          transition={{
            duration: 0.52,
            ease: [
              0.22,
              1,
              0.36,
              1,
            ],
          }}
        >

          {screen === 0 && (

            <EntryScreen
              enter={
                enterExperience
              }
            />

          )}


          {screen === 1 && (

            <BirthdayScreen
              next={
                goNext
              }
            />

          )}


          {screen === 2 && (

            <DateScreen
              next={
                goNext
              }
            />

          )}


          {screen === 3 && (

            <MissionScreen
              next={
                goNext
              }
              sound={
                playSfx
              }
            />

          )}


          {screen === 4 && (

            <AdventureScreen
              next={
                goNext
              }
            />

          )}


          {screen === 5 && (

            <RsvpScreen
              name={name}
              setName={
                setName
              }
              answer={
                answer
              }
              setAnswer={
                setAnswer
              }
              error={
                error
              }
              confirm={
                confirm
              }
              sound={
                playSfx
              }
            />

          )}


          {screen === 6 && (

            <FinalScreen />

          )}

        </motion.section>

      </AnimatePresence>

    </main>

  );

}


function EntryScreen({
  enter,
}: {
  enter: () => void;
}) {

  return (

    <div className="content entry-content">

      <motion.div
        className="trick-logo"
        initial={{
          y: -35,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          duration: 0.7,
        }}
      >

        <div className="trick-jump">
          {"\u2605"}
        </div>

        <div className="trick-word">

          <span>
            TR
          </span>

          <span>
            ICK
          </span>

        </div>

        <div className="trick-events">
          EVENTOS
        </div>

      </motion.div>


      <motion.div
        className="entry-title"
        initial={{
          scale: 0.7,
          opacity: 0,
        }}
        animate={{
          scale: 1,
          opacity: 1,
        }}
        transition={{
          delay: 0.3,
          type: "spring",
          stiffness: 130,
        }}
      >

        <p>
          {"\u00BFESTAS LISTO?"}
        </p>

        <h1>
          BEN
        </h1>

        <h2>
          CUMPLE 7
        </h2>

      </motion.div>


      <motion.button
        type="button"
        className="neon-button start-button"
        onClick={enter}
        animate={{
          scale: [
            1,
            1.05,
            1,
          ],
        }}
        transition={{
          duration: 1.4,
          repeat: Infinity,
        }}
      >

        ENTRAR

        <span>
          {"\uD83D\uDE80"}
        </span>

      </motion.button>

    </div>

  );

}


function BirthdayScreen({
  next,
}: {
  next: () => void;
}) {

  return (

    <div className="content birthday-content">

      <motion.div
        className="giant-seven"
        initial={{
          scale: 0,
          rotate: -18,
          opacity: 0,
        }}
        animate={{
          scale: [
            1,
            1.045,
            0.985,
            1.035,
            1,
          ],
          rotate: [
            -3,
            3,
            -2,
            2,
            -3,
          ],
          y: [
            0,
            -12,
            5,
            -8,
            0,
          ],
          opacity: 1,
        }}
        transition={{
          scale: {
            duration: 3.2,
            repeat: Infinity,
            ease: "easeInOut",
          },
          rotate: {
            duration: 3.2,
            repeat: Infinity,
            ease: "easeInOut",
          },
          y: {
            duration: 3.2,
            repeat: Infinity,
            ease: "easeInOut",
          },
          opacity: {
            duration: 0.5,
          },
        }}
      >

        7

      </motion.div>


      <motion.p
        className="eyebrow"
        initial={{
          opacity: 0,
          y: -15,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 0.25,
        }}
      >

        {
          "CUMPLEA\u00D1OS DE"
        }

      </motion.p>


      <motion.h1
        className="ben-title"
        initial={{
          x: -100,
          opacity: 0,
        }}
        animate={{
          x: 0,
          opacity: 1,
        }}
        transition={{
          delay: 0.15,
          type: "spring",
        }}
      >

        BEN

      </motion.h1>


      <motion.p
        className="birthday-subtitle"
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: [
            0,
            -7,
            0,
            5,
            0,
          ],
          rotate: [
            0,
            -1,
            0,
            1,
            0,
          ],
        }}
        transition={{
          opacity: {
            delay: 0.45,
            duration: 0.6,
          },
          y: {
            delay: 0.9,
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          },
          rotate: {
            delay: 0.9,
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      >

        La aventura esta por empezar...

      </motion.p>


      <div className="birthday-button-zone">

        <NextButton
          onClick={next}
          text="SEGUIR"
        />

      </div>

    </div>

  );

}

function DateScreen({
  next,
}: {
  next: () => void;
}) {

  return (

    <div className="content">


      <motion.div
        className="date-number"
        initial={{
          scale: 0.3,
          rotate: 8,
        }}
        animate={{
          scale: 1,
          rotate: 0,
        }}
        transition={{
          type: "spring",
          stiffness: 115,
        }}
      >

        28

      </motion.div>


      <motion.div
        className="date-month"
        initial={{
          letterSpacing:
            "1.5em",
          opacity: 0,
        }}
        animate={{
          letterSpacing:
            "0.16em",
          opacity: 1,
        }}
        transition={{
          delay: 0.25,
          duration: 0.8,
        }}
      >

        DE OCTUBRE

      </motion.div>


      <div className="tiny-stars">

        <span>
          {"\u2605"}
        </span>

        <span>
          {"\u2605"}
        </span>

        <span>
          {"\u2605"}
        </span>

      </div>


      <NextButton
        onClick={next}
        text="CONTINUAR"
      />

    </div>

  );

}


function MissionScreen({
  next,
  sound,
}: {
  next: () => void;
  sound: (
    file: string
  ) => void;
}) {

  return (

    <div className="content">

      <motion.div
        className="mission-panel"
        initial={{
          clipPath:
            "inset(50% 50% 50% 50%)",
        }}
        animate={{
          clipPath:
            "inset(0% 0% 0% 0%)",
        }}
        transition={{
          duration: 0.7,
        }}
      >

        <p className="mission-label">
          MISION
        </p>

        <h1>
          CUMPLE DE BEN
        </h1>


        <div className="mission-row">

          <div className="mission-icon">
            {"\u23F0"}
          </div>

          <div>

            <span>
              HORARIO
            </span>

            <strong>
              18:00 HS A
              <br />
              20:30 HS
            </strong>

          </div>

        </div>


        <div className="mission-row">

          <div className="mission-icon">
            {"\uD83D\uDCCD"}
          </div>

          <div>

            <span>
              LUGAR
            </span>

            <strong>
              GRIMALDI 3860
            </strong>

          </div>

        </div>


        <a
          href={MAP_URL}
          target="_blank"
          rel="noreferrer"
          className="neon-button map-link"
          onClick={() =>
            sound("click")
          }
        >

          VER UBICACION

        </a>

      </motion.div>


      <NextButton
        onClick={next}
        text="SIGUIENTE"
      />

    </div>

  );

}


function AdventureScreen({
  next,
}: {
  next: () => void;
}) {

  const items = [
    {
      icon:
        "\uD83C\uDFAE",
      text:
        "JUGAR",
    },
    {
      icon:
        "\uD83D\uDE80",
      text:
        "DIVERTIRNOS",
    },
    {
      icon:
        "\uD83C\uDF82",
      text:
        "FESTEJAR LOS 7 DE BEN",
    },
  ];


  return (

    <div className="content">

      <motion.p
        className="mission-label"
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
      >

        {
          "\u00BFESTAS LISTO PARA LA MISION?"
        }

      </motion.p>


      <div className="adventure-list">

        {items.map(
          (
            item,
            index
          ) => (

            <motion.div
              className="adventure-card"
              key={
                item.text
              }
              initial={{
                x:
                  index % 2 === 0
                    ? -120
                    : 120,
                opacity: 0,
              }}
              animate={{
                x: 0,
                opacity: 1,
              }}
              transition={{
                delay:
                  0.15 +
                  index * 0.18,
                type:
                  "spring",
              }}
            >

              <span>
                {item.icon}
              </span>

              <strong>
                {item.text}
              </strong>

            </motion.div>

          )
        )}

      </div>


      <motion.h2
        className="wait-title"
        initial={{
          scale: 0,
        }}
        animate={{
          scale: 1,
        }}
        transition={{
          delay: 0.8,
          type: "spring",
        }}
      >

        {
          "\u00A1TE ESPERAMOS!"
        }

      </motion.h2>


      <NextButton
        onClick={next}
        text="CONFIRMAR"
      />

    </div>

  );

}


function RsvpScreen({
  name,
  setName,
  answer,
  setAnswer,
  error,
  confirm,
  sound,
}: {
  name: string;
  setName: (
    value: string
  ) => void;
  answer: Answer;
  setAnswer: (
    value: Answer
  ) => void;
  error: string;
  confirm: () => void;
  sound: (
    file: string
  ) => void;
}) {

  const choose = (
    value: Answer
  ) => {

    sound(
      "click"
    );

    setAnswer(
      value
    );

  };


  return (

    <div className="content">

      <p className="mission-label">
        ULTIMA MISION
      </p>

      <h1 className="rsvp-title">
        {
          "\u00BFVENIS?"
        }
      </h1>


      <label className="name-field">

        <span>
          TU NOMBRE
        </span>

        <input
          value={name}
          onChange={(
            event
          ) =>
            setName(
              event.target.value
            )
          }
          placeholder="Escribilo aca..."
          autoComplete="name"
        />

      </label>


      <div className="answer-grid">

        <AnswerButton
          active={
            answer === "yes"
          }
          onClick={() =>
            choose("yes")
          }
        >
          {
            "SI, VOY \uD83D\uDE80"
          }
        </AnswerButton>


        <AnswerButton
          active={
            answer === "maybe"
          }
          onClick={() =>
            choose("maybe")
          }
        >
          {
            "TODAVIA NO SE"
          }
        </AnswerButton>


        <AnswerButton
          active={
            answer === "no"
          }
          onClick={() =>
            choose("no")
          }
        >
          NO VOY A PODER
        </AnswerButton>

      </div>


      {error && (

        <p className="form-error">
          {error}
        </p>

      )}


      <button
        type="button"
        className="neon-button confirm-button"
        onClick={confirm}
      >

        CONFIRMAR

      </button>

    </div>

  );

}


function FinalScreen() {

  return (

    <div className="content final-screen">

      <motion.div
        className="success-ring"
        initial={{
          scale: 0,
          rotate: -180,
        }}
        animate={{
          scale: 1,
          rotate: 0,
        }}
        transition={{
          type: "spring",
          stiffness: 95,
        }}
      >

        {
          "\u2605"
        }

      </motion.div>


      <motion.h1
        initial={{
          y: 40,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          delay: 0.2,
        }}
      >

        {
          "\u00A1GENIAL!"
        }

      </motion.h1>


      <motion.h2
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          delay: 0.5,
        }}
      >

        BEN TE ESPERA

      </motion.h2>


      <p>
        28 DE OCTUBRE
      </p>

      <strong>
        18:00 HS
      </strong>


      <motion.div
        className="final-rocket"
        animate={{
          y: [
            20,
            -15,
            20,
          ],
          rotate: [
            -4,
            4,
            -4,
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
      >

        {
          "\uD83D\uDE80"
        }

      </motion.div>


      <p className="final-message">
        NOS VEMOS
      </p>

    </div>

  );

}


function NextButton({
  onClick,
  text,
}: {
  onClick: () => void;
  text: string;
}) {

  return (

    <motion.button
      type="button"
      className="neon-button next-button"
      onClick={onClick}
      whileTap={{
        scale: 0.94,
      }}
      whileHover={{
        scale: 1.04,
      }}
    >

      {text}

      <span>
        {"\u2192"}
      </span>

    </motion.button>

  );

}


function AnswerButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children:
    React.ReactNode;
}) {

  return (

    <button
      type="button"
      className={
        active
          ? "answer-button active"
          : "answer-button"
      }
      onClick={onClick}
    >

      {children}

    </button>

  );

}


function BackgroundEffects() {

  const stars =
    Array.from({
      length: 48,
    });


  return (

    <div
      className="background-effects"
      aria-hidden="true"
    >

      <div className="aurora aurora-one" />
      <div className="aurora aurora-two" />


      {stars.map(
        (
          _,
          index
        ) => (

          <span
            key={index}
            className={
              `star star-${index % 4}`
            }
            style={{
              left:
                `${(index * 37) % 100}%`,
              top:
                `${(index * 61) % 100}%`,
              animationDelay:
                `${(index % 12) * 0.18}s`,
              animationDuration:
                `${3.5 + (index % 7) * 0.55}s`,
            }}
          />

        )
      )}


      <div className="scanlines" />

    </div>

  );

}