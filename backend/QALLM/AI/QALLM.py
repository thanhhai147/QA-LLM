import google.generativeai as genai
import os
from openai import OpenAI
from huggingface_hub import login
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig 
from transformers import pipeline
client = OpenAI(api_key="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")

os.environ["GOOGLE_API_KEY"] = "AIzaSyBwRi6f7aoxXxpwy5RhOThn0cOOV9_zI50"
genai.configure(api_key=os.environ["GOOGLE_API_KEY"])
gemini_model = genai.GenerativeModel("models/gemini-1.5-pro")

API_TOKEN = "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"
login(token=API_TOKEN)

model_id = "meta-llama/Llama-3.2-3B-Instruct"
tokenizer = AutoTokenizer.from_pretrained(model_id, token=True, trust_remote_code=True)
model = AutoModelForCausalLM.from_pretrained(model_id, token=True, trust_remote_code=True)

def gemini(prompt, model = gemini_model):
    response = model.generate_content(prompt).text.strip()
    return(response)

def chatgpt(prompt, client = client):
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "user", "content": prompt}
        ]
    )
    response = completion.choices[0].message.content
    return(response)

def llama(prompt):
    pipe = pipeline(
        "text-generation",
        model=model,
        tokenizer=tokenizer,
        torch_dtype="auto",
        device_map="auto",
    )
    
    messages = [{"role": "user", "content": prompt}]
    
    outputs = pipe(messages, max_new_tokens=256)
    
    response = outputs[0]["generated_text"][-1]['content']
    return response


def infer(source , technique_prompt, context, question):
    prompt = technique_prompt(context, question)
    if source == "gemini-1.5-pro":
        answer = gemini(prompt)
    if source == "gpt-4.o-mini":
        answer = chatgpt(prompt)
    if source == "llama-3.2-3b-instruct":
        answer = llama(prompt)
    return answer