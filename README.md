# req2stdout

## What

Log incoming http request to stdout.

## Why

There are free public SAAS counterparts such as https://requestcatcher.com/. But if there is egress firewall, such as in some corporate environments, reaching the public SAAS can be a challenge. In such case running request logger on an internal localhost maybe inadequate either if the request comes from a remote host.

`req2stdout` not only can be deployed internally but provides a Helm chart to facilitate deploying to internal OpenShift. Hence could be a rescue.

## How

There are 3 ways to deploy _req2stdout_,

1. run `helm install req2stdout helm` from cwd after logging into OpenShift with `oc login`. The Helm creates an OpenShift route to expose HTTP endpoint referenced as `<req2stdout-host>` below.
2. run `docker run --init --platform linux/amd64 --rm -p 3000:3000 ghcr.io/f-w/req2stdout`
3. copy _req2stdout_ to a host with node.js installed and run `node .` from cwd.

To use, send a request, for example `curl -d 'Hello World!' https://<req2stdout-host>`, and observe the container log in OpenShift web console. Requests containing URL path are also logged except for `/_probe`, which is reserved for k8s liveness and readiness probe.

Sample stdout when running above cmd

```
=== Incoming Request ===
Time: 2025-08-22T10:04:51.533-07:00
Method: POST
URL: /
Headers:
{
  "user-agent": "curl/8.8.0",
  "accept": "*/*",
  "content-length": "12",
  "content-type": "application/x-www-form-urlencoded",
  "host": "<req2stdout-host>",
  "x-forwarded-host": "<req2stdout-host>",
  "x-forwarded-port": "443",
  "x-forwarded-proto": "https",
  "forwarded": "for=<real-ip>;host=<req2stdout-host>;proto=https",
  "x-forwarded-for": "<real-ip>"
}
Body Length: 12
Body:
Hello World!
```

Response is `200 OK` with body `Request received and logged`.
