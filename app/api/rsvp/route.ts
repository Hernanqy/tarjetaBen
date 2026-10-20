const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycby6iQD3J3p1Y-f_35rcNxcETSOKaFfDBP2WX6DCGmNNxmOgIMz9kU_6LC8PpOJ8gJUORg/exec";


export async function POST(
  request: Request
) {

  try {

    const body =
      await request.text();


    const googleResponse =
      await fetch(
        APPS_SCRIPT_URL,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/x-www-form-urlencoded;charset=UTF-8",
          },

          body,

          redirect:
            "follow",

          cache:
            "no-store",
        }
      );


    const result =
      await googleResponse.text();


    if (
      !googleResponse.ok
    ) {

      console.error(
        "Apps Script error:",
        result
      );


      return Response.json(
        {
          ok: false,
          error:
            "GOOGLE_REQUEST_FAILED",
        },
        {
          status: 502,
        }
      );

    }


    return new Response(
      result,
      {
        status: 200,

        headers: {
          "Content-Type":
            "application/json; charset=utf-8",
        },
      }
    );

  }
  catch (error) {

    console.error(
      "RSVP server error:",
      error
    );


    return Response.json(
      {
        ok: false,
        error:
          "RSVP_SERVER_ERROR",
      },
      {
        status: 500,
      }
    );

  }

}