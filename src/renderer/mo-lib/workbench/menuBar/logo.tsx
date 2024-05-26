import React from 'react';

export interface ILogoProps {
  className: string;
}

export default function Logo({ className }: ILogoProps) {
  return (
    <img
      alt="logo"
      className={className}
      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAFbElEQVRYhcWXW2xURRjHfzN7evZ0KcsW2qUQioW2IhTSKpSLoVACQdREQV9ENIDEB288aPRREo2JL16CD+I1Jir6AEIUFK0QKiKKl7RA6UVoRSj2Tm272+3u2TM+7OXsrZRC1P/L3L7Lf2a+mflGgA5AWfmDElgHbAJuA3IASTK0aJnaL0cpY3UJDAG/AO8B+xvqd1sAAnTKyh90AW8iWBtTFqmGVNxQvF+JaFvZfSKiKFVUR8R0hG1LKQ4Amxrqdw+JsvItEngPwbpE4/8mgQgJ9TmI+yWwNsH5f4n1oO6RRPb8/8KjGlAx2qjudMmZJZW6Z/IMTTocoFRScKlEYQUIFatL0wzS29lqXWqrwwqbo7lYpAlBjsowUjy3yrWwamOOrhvjmVEqpG+wj+M1b1tdl1syjbvF/IotbQoSvciSeVXG0lVb3UKAFQ5zpeeiGQoF0ownN5On4TRypGdKIUKAaYao2fey1dvZZktHVjOgkQLdOYFFyze6hYC+7otW7VdvDPj+7rESnNrHyT4FiScAotuT552lrbzrKc2V42Hpqq3y4KfPW6Qg9UKhqHSxkaUbhMNhar/c2e8b6EndwDQj9qyS2z2dbdaJw++bALl5M5jiLUrTSSOQm1eoA/R1XzB9g72jOrtW/HXxDKFgZPs8UwrT/MU7DGcW2YYupXQAYIZGMhq8b8MKo+bQK+6dr293Gc6sWHec6LZH7ta//fpV44Udj+hSCpSybTm0LAxDR9fjehECSyrn6j8d31Xw6cc78jJ6FbaDZ595wJg6NZfqlRXamtWLkmLI7XbJ7U/cp3nzPWy4d7msKC9Nm/EnHz4vT/6wSy68bY5NoKBgspRSIFKlM8DI1uN1V7Yz6Wo2nDoiIRJd2c6MNqQUeL25tuJ4cOZMmwUQDlucbmhLCtDevgGrvb0HgOHhIC3nLo0ZQ2nHcCw8/uRrQ3esrdQbm/+0GpsuJDkIhy0e3vpSoHrlrdqvvzVbXV1XxrSnAXR19VtKpV4lmTE46Lf27K0NAkyYYMgtm9fpsXvgaG2debbxD/bsPWpGbWVcYaWgu7vfJnDip4bgsqrHOhBCLlj8gBvA4Rh7cXz+AGYoTPHs6Qz5ArRf7rEyORXRk6WUxabNL6IU+P0Bm0DE2AiANdDfYQJM8c7S3J4CLdYeDW+9+0UwQz4Qx8RJ+TiNnIiPgV7L7x9BKZtkGtvWpuOB4MgwDk1jzfrn3NMKy/RUmWuFQ8tiSfVmTQgYCfjovNyUJpPxMZpRVK6vuPMJj8OhoRR0XGo0m+trAu1/1FtKKfKnl2qT82dK7MzHNhjtM7InUnTzUs3t8QJwsvYjq+X0EYDoCiiAQEYCAN6CEn3Z6m1ud+7U+Cr5Bvs4f/b7wO9na03XhEmyeN4Kvah0saY7XaOuglLQ8OtBq+7HvYl9YxMQgJAOWTx3uTFnwWpXbt6MOBHLsrh84ZTZcuao2dneZM4sXqSXzKvS3J6CuEwoNEJvZ6vVcvqI1f3XudSk9NoIkJCE5k0t1krnVxs3lVTqWpYdFkMDvZxrPBY83/Cd6ff120mpSk5gxQ0RSDCWpWfL2bfcrpeUrdQTV8U/1M9nHzztj8kpW++qBMZ9E4aCwzSfOhxsPnU4mDetWCstq9ZvKqnUhIi8fKnHcCxoSjGE4LoSv+6O81Z3x/nAz8d2y8JZFeOeDDAggbrrcZ6I0MgwrU0nrnphjYKTEvj4RglwlTQNuMozL96RwDcoDt0ggXE/68B+4ICju/Os8hYsqAFKEZQSJRxlHSOfWNoTEmnjsSBMkhfJsgD7QDzUUL87KFK+52uAh4EKISLf85SrNjHQUr/gmcpYPfV7fiD2Pf8HQDcJ/adEsK8AAAAASUVORK5CYII="
    />
  );
}
