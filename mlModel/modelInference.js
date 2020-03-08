//const onnx = require('onnxjs');
const onnx = require('onnxjs-node');

// uncomment the following line to enable ONNXRuntime node binding
// require('onnxjs-node');

const assert = require('assert');

async function main() {
  // Create an ONNX inference session with WebAssembly backend.
  //const session = new onnx.InferenceSession({backendHint: 'wasm'});
  const session = new onnx.InferenceSession();

  // Load an ONNX model. This model takes two tensors of the same size and return their sum.
  await session.loadModel("./myModel.onnx");

  const x = new Float32Array(1).fill(.5);                      // Creates input data as js datatype, fill is input value
  const tensorX = new onnx.Tensor(x, 'float32', [1,1]);       // Converts input to onnx.js tensor
  console.log(`Input tensor is ${tensorX.data}`);      // Debugging

  // Run model with Tensor inputs and get the result by output name defined in model.
  const outputMap = await session.run([tensorX]);             // Forward pass
  const outputDataTensor = outputMap.get("Output") ;          // Output from Forward pass as OJS Tensor
  const outputDataValue = outputDataTensor.data[0]               // Scalar Output value from Forward pass

  //console.log(`Output tensor is ${outputMap}`);             // Debugging
  console.log(outputDataValue);   //Should get 0.43618810176849365

  // Check if result is expected.
  //console.log(`Got an Tensor of size ${outputDataTensor.data.length} with all elements being ${outputDataTensor.data[0]}`);
}

main();
