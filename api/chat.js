export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).send("Método não permitido");
    }

    const body = await req.json();
    const mensagem = body.mensagem;

    if (!mensagem) {
      return res.status(400).send("Mensagem vazia");
    }

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
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

    const data = await r.json();

    if (!data.choices || !data.choices[0]) {
      return res.status(500).send("Erro na resposta da OpenAI");
    }

    // TEXTO PURO (BDFD compatível)
    res.status(200).send(data.choices[0].message.content);

  } catch (e) {
    res.status(500).send("Erro na IA");
  }
}
