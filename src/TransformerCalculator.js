import React, { useState, useEffect } from 'react';
import './TransformerCalculator.css';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import GitHubLogoLight from './GitHub_Logo.png';
import GitHubLogoDark from './GitHub_Logo_White.png';

import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";


function TransformerCalculator() {
    const [gpus, setGpus] = useState('');
    const [tflops, setTflops] = useState('');
    const [parameters, setParameters] = useState('');
    const [tokens, setTokens] = useState('');
    const [result, setResult] = useState('');
    const [theme, setTheme] = useState('null');
    const githubLogo = theme === 'light' ? GitHubLogoLight : GitHubLogoDark;

    useEffect(() => {
        // Set the initial theme based on the user's system preference
        const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDarkMode ? 'dark' : 'light');
    }, []);

    useEffect(() => {
        // Update the theme on the HTML element whenever the theme state changes
        if (theme) {
        document.documentElement.setAttribute('data-bs-theme', theme);
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };
  
    const totalComputeRequired = (bp, bt, nGpus) => {
        const c = nGpus > 1 ? 8 : 6;
        return c * bp * 1e9 * bt * 1e9;
    };

    const totalTrainingDays = (tc, gpuFlops, nGpus) => {
      return tc / (nGpus * gpuFlops) / 86400;
    };

    const formatSetupResults = (nGpus, gpuFlops, bParameters, bTokens, days) => {
        const gpuText = nGpus === 1 ? 'GPU' : 'GPUs';
      
        const response = (
          <span>
            {nGpus > 99 && <span><strong>Wow! You must be GPU rich! 💰💰💰</strong></span>}
            Training a <strong>{bParameters} billion parameter</strong> model on <strong>{bTokens} billion tokens</strong> with <strong>{nGpus} {gpuText}</strong> with <strong>{gpuFlops} TFLOPs</strong> will roughly take <strong>{days.toFixed(2)} days</strong>.
          </span>
        );
      
        return response;
      };

    const calculateTime = () => {
        // Ensure the input values are numbers and handle any potential errors
        const numGpus = parseInt(gpus) || 0;
        const numTflops = parseFloat(tflops) || 0;
        const numParameters = parseFloat(parameters) || 0;
        const numTokens = parseFloat(tokens) || 0;
      
        // Perform the calculations with the input values
        const tc = totalComputeRequired(numParameters, numTokens, numGpus);
        const days = totalTrainingDays(tc, numTflops * 1e12, numGpus); // Convert TFLOPs to FLOPs
      
        // Format the results and set the state
        const formattedResult = formatSetupResults(numGpus, numTflops, numParameters, numTokens, days);
        setResult(formattedResult);

        // Scroll to the bottom of the page
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth'
        });
      };

  return (
    <div className='transformer-calculator'>
        <Container>
            <Button className="toggle-theme" onClick={toggleTheme} variant="outline-secondary">
            	
            {theme === 'light' ? <i class="bi bi-moon-stars"></i> : <i class="bi bi-sun-fill"></i>}
            </Button>
            <a href="https://github.com/stoyan-stoyanov/transformers-calculator" target="_blank">
                <Image className="github-logo" src={githubLogo}/>
            </a>
            <Row>
                <h1>👾 Transformers Calculator</h1>
            </Row>
            <Row>
                <Col>
                    <Card className='box'>
                        <Card.Body>
                            <Card.Text>
                                ℹ️ This is a simple calculator tool that can help you get an idea of how much time it would take to train a transformer model. The calculator uses the equations from <a href="https://medium.com/@dzmitrybahdanau/the-flops-calculus-of-language-model-training-3b19c1f025e4" target="_blank">this</a> blog post.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card className='box'>
                        <Card.Body>
                        <InputGroup className="mb-3">
                            <InputGroup.Text>Number of GPUs:</InputGroup.Text>
                            <Form.Control
                                value={gpus}
                                onChange={e => setGpus(e.target.value)}
                                type="number"
                            />
                        </InputGroup>
                        <InputGroup className="mb-3">
                            <InputGroup.Text>TFLOPs per GPU:</InputGroup.Text>
                            <Form.Control
                                value={tflops}
                                onChange={e => setTflops(e.target.value)}
                                type="number"
                                step="0.01"
                            />
                        </InputGroup>
                        <InputGroup className="mb-3">
                            <InputGroup.Text>Parameters:</InputGroup.Text>
                            <Form.Control
                                value={parameters}
                                onChange={e => setParameters(e.target.value)}
                                type="number"
                                step="0.1"
                            />
                            <InputGroup.Text>billion</InputGroup.Text>
                        </InputGroup>
                        <InputGroup className="mb-3">
                            <InputGroup.Text>Tokens:</InputGroup.Text>
                            <Form.Control
                                value={tokens}
                                onChange={e => setTokens(e.target.value)}
                                type="number"
                                step="1"
                            />
                            <InputGroup.Text>billion</InputGroup.Text>
                        </InputGroup>

                        <Button variant="primary" onClick={calculateTime}>
                        Calculate
                        </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col>
                {result && (
                    <Card className='box'>
                        <Card.Header>💡 Result</Card.Header>
                        <Card.Body>
                        <Card.Text>
                            {result}
                        </Card.Text>
                        </Card.Body>
                    </Card>
                    )}
                </Col>
            </Row>
        </Container>
      
    </div>
  );
};

export default TransformerCalculator;