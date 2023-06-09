docker-build:
	docker stop quan || true && docker rm quan || true
	docker rmi quan-img || true
	docker build -t quan-img .

docker-run: build
	docker-compose up

start-debug:
	export POSTGRES_DB=quan_db && \
	export POSTGRES_USER=quan && \
	export POSTGRES_PASSWORD=Password12345 && \
	export POSTGRES_HOST=localhost && \
	export POSTGRES_PORT=5432 && \
	export REDIS_PASSWORD=Password12345 && \
	export REDIS_HOST=localhost && \
	export REDIS_PORT=6379 && \
	npm run debug

start:
	npm run build
	export POSTGRES_DB=quan_db && \
	export POSTGRES_USER=quan && \
	export POSTGRES_PASSWORD=Password12345 && \
	export POSTGRES_HOST=localhost && \
	export POSTGRES_PORT=5432 && \
	export REDIS_PASSWORD=Password12345 && \
	export REDIS_HOST=localhost && \
	export REDIS_PORT=6379 && \
	npm run start

run-unit-tests:
	npm run build
	npm run tests

run-end-to-end-tests:
	python3 ./tests/test.py

run-tests: run-unit-tests run-end-to-end-tests

install:
	npm install
	npm install ts-node --save-dev