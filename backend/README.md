# OCUPA backend — Fase 1

Fundação em FastAPI, PostgreSQL, SQLAlchemy 2.0 e Alembic. Nesta fase há somente o
endpoint operacional `GET /health`; autenticação e endpoints de domínio ainda não
fazem parte da API.

## Ambiente local

Requer Python 3.12+ e Docker com Compose.

```bash
cd backend
cp .env.example .env
python -m venv .venv
source .venv/bin/activate
pip install -e '.[test]'
docker compose up -d postgres postgres-test
alembic upgrade head
python -m app.seed
uvicorn app.main:app --reload
```

A documentação interativa fica em `http://localhost:8000/docs`.

## Testes

O serviço `postgres-test` usa um banco separado, em memória temporária no container,
e é publicado na porta 5434.

```bash
docker compose up -d postgres-test
pytest
```

Por segurança, a suíte recusa `TEST_DATABASE_URL` se o nome do banco não terminar em
`_test`. O schema de aplicação deve ser alterado por migrations Alembic; `create_all`
é usado apenas para isolar os testes.
