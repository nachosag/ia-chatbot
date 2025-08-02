// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { message } = req.body;
    // En un futuro, aquí llamarías a tu modelo de IA
    // Por ahora, devolvemos una respuesta simulada
    res.status(200).json({ reply: `Recibí tu mensaje: "${message}". Estoy pensando en una respuesta.` });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
