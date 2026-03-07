import { ImageResponse } from 'next/og';
import { Octokit } from 'octokit';

// Stack: Next.js 16 + React 19 + TypeScript 6.0
// Runtime: Edge ou Node 24 (suportado pelo Next.js)
export const runtime = 'nodejs';

// Configurações da imagem para Redes Sociais
export const alt = 'GitHub Project Detail - Sérgio Santos';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Instância do Octokit para buscar o nome do repositório
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; // No Next.js 16, params é uma Promise
  const username = "SEU_USUARIO_GITHUB"; // Substitua pelo seu login

  let repoData = { name: slug, description: "Engenharia de Dados & Automação" };

  try {
    // Busca dados em tempo real para a imagem ser fiel ao GitHub
    const { data } = await octokit.rest.repos.get({
      owner: username,
      repo: slug,
    });
    repoData.name = data.name;
    repoData.description = data.description || repoData.description;
  } catch (e) {
    console.error("Erro ao buscar dados para OG Image:", e);
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          backgroundColor: '#0f172a', // Slate 950
          backgroundImage: 'radial-gradient(circle at 25% 25%, #1e293b 0%, #0f172a 100%)',
          padding: '80px',
        }}
      >
        {/* Badge de Categoria */}
        <div style={{
          display: 'flex',
          backgroundColor: '#38bdf8', // Sky 400
          color: '#0f172a',
          padding: '8px 16px',
          borderRadius: '4px',
          fontSize: '24px',
          fontWeight: 'bold',
          marginBottom: '20px',
          textTransform: 'uppercase'
        }}>
          Data Project
        </div>

        {/* Nome do Repositório (Slug dinâmico) */}
        <h1 style={{
          fontSize: '84px',
          fontWeight: 'bold',
          color: 'white',
          margin: 0,
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
        }}>
          {repoData.name}
        </h1>

        {/* Descrição curta */}
        <p style={{
          fontSize: '32px',
          color: '#94a3b8', // Slate 400
          marginTop: '20px',
          maxWidth: '900px',
          lineHeight: 1.4,
        }}>
          {repoData.description}
        </p>

        {/* Footer com Identidade Visual */}
        <div style={{
          display: 'flex',
          marginTop: 'auto',
          width: '100%',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid #1e293b',
          paddingTop: '40px'
        }}>
          <div style={{ display: 'flex', color: 'white', fontSize: '28px', fontWeight: '600' }}>
            Sérgio Santos
          </div>
          <div style={{ display: 'flex', color: '#38bdf8', fontSize: '24px' }}>
            github.com/{username}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
