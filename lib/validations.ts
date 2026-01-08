import { z } from "zod";

export const authSchema = z.object({
  nome: z.string().min(2, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  telefone: z.string().min(10, "Telefone inválido"),
  senha: z.string()
    .min(6, "Mínimo de 6 caracteres")
    .regex(/[!@#$%^&*(),.?":{}|<>]/, "Precisa de um caractere especial"),
});

export const funcionarioSchema = z.object({
  nome: z.string().min(2, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  telefone: z.string().min(10, "Telefone inválido"),
  profissao: z.string().min(2, "Profissão é obrigatória"),
  funcao: z.string().min(2, "Função é obrigatória"),
  setor: z.string().min(2, "Setor é obrigatório"),
  unidade: z.string().min(2, "Unidade é obrigatória"),
  organizacao: z.string().min(2, "Organização é obrigatória"),
  gerente: z.string().min(2, "Gerente é obrigatório"),
  idioma: z.string().default("Português"),
  login: z.string().min(4, "Login deve ter 4+ caracteres"),
  senha: z.string().min(6, "Senha deve ter 6+ dígitos"),
});