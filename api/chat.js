export default async function handler(req, res) {
  try {
    const body = await new Response(req.body).json();
    const mensagem = body.mensagem || "Olá";

    const resposta = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "user", content: mensagem }
        ],
        max_tokens: 150
      })
    });

    const data = await resposta.json();

    // RESPONDE TEXTO PURO (BDFD SEM $jsonRequest)
    res.status(200).send(data.choices[0].message.content);

  } catch (erro) {
    res.status(500).send("Erro na IA");
  }
}
