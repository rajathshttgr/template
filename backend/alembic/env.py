from logging.config import fileConfig
import os
from sqlalchemy import engine_from_config, pool
from alembic import context
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import your SQLAlchemy Base (contains all models)
from app.core.db import Base  # make sure Base is the declarative_base() containing all models

# Alembic Config object
config = context.config

# Override the sqlalchemy.url from .env
config.set_main_option("sqlalchemy.url", os.getenv("DATABASE_URL"))

# Setup logging
fileConfig(config.config_file_name)

# Set target_metadata for 'autogenerate'
target_metadata = Base.metadata

# Offline migrations
def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


# Online migrations
def run_migrations_online() -> None:
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
