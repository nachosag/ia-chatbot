from typing import List
from ollama import AsyncClient
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()
client = AsyncClient()
model = "sigrh"

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especifica los orígenes permitidos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]

@app.post("/api/chat")
async def chat(request: ChatRequest):
    try:
        print("Recibiendo mensaje:", request.messages)  # Debug
        stream = await client.chat(
            model=model,
            messages=[{"role": m.role, "content": m.content} for m in request.messages],
            stream=True,
            keep_alive=10.0,
        )
        
        assistant_response = ""
        async for chunk in stream:
            if chunk and "message" in chunk and "content" in chunk["message"]:
                part = chunk["message"]["content"]
                print("Chunk recibido:", part)  # Debug
                assistant_response += part
            else:
                print("Chunk inválido recibido:", chunk)  # Debug

        print("Respuesta final:", assistant_response)  # Debug
        return {"reply": assistant_response if assistant_response else "Lo siento, no pude generar una respuesta."}
    except Exception as e:
        print(f"Error en el chat: {str(e)}")  # Debug
        return {"reply": f"Error: {str(e)}"}
