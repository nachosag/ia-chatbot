from ollama import AsyncClient
import asyncio


async def main():
    client = AsyncClient()
    model = "sigrh"
    print("Inicia una conversación con el modelo. Escribe 'salir' para terminar.")
    messages: list[dict[str, str]] = []
    while True:
        prompt = input("Tú: ")
        if prompt.lower() in ["salir", "exit", "quit"]:
            print("Conversación finalizada.")
            break
        messages.append({"role": "user", "content": prompt})
        stream = await client.chat(
            model=model,
            messages=messages,
            stream=True,
            keep_alive=10.0,
        )
        assistant_response = ""
        print("Modelo: ", end="")
        async for chunk in stream:
            part = chunk["message"]["content"]
            print(part, end="", flush=True)
            assistant_response += part

        if assistant_response:
            messages.append({"role": "assistant", "content": assistant_response})
        print()


if __name__ == "__main__":
    asyncio.run(main())
