docker-build:
	docker stop quan || true && docker rm quan || true
	docker rmi quan-img || true
	docker build -t quan-img .

docker-run: build
	docker-compose up

run:
	export POSTGRES_DB=quan_db && \
	export POSTGRES_USER=quan && \
	export POSTGRES_PASSWORD=Password12345 && \
	export POSTGRES_HOST=localhost && \
	export POSTGRES_PORT=5432 && \
	export REDIS_PASSWORD=Password12345 && \
	export REDIS_HOST=localhost && \
	export REDIS_PORT=6379 && \
	npm run start