/**
 * The examples provided by Oculus are for non-commercial testing and
 * evaluation purposes only.
 *
 * Oculus reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL
 * OCULUS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
 * AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * Example ReactVR app that allows a simple tour using linked 360 photos.
 */
import { VRInstance } from 'react-vr-web';
import SimpleRaycaster from 'simple-raycaster';
import * as OVRUI from 'ovrui';

function init(bundle, parent, options) {
  OVRUI.loadFont(
    '../static_assets/BaronNeue.fnt',
    '../static_assets/BaronNeue_sdf.png',
  ).then((font) => {
    const vr = new VRInstance(bundle, 'TourSample', parent, {
      // Show a gaze cursor.
      // On affiche le curseur uniquement sur mobile ou casque VR.
      raycasters: window.navigator.userAgent.includes('VR') || window.navigator.userAgent.includes('Mobile')
        ? [
          {
            ...SimpleRaycaster,
            ...{
              getRayOrigin() {
                return [0, 0, 0];
              },
              getRayDirection() {
                return [0, 0, -1];
              },
            },
          },
        ] : null,
      cursorVisibility: 'visible',
      font,
      ...options,
    });

    // Begin the animation loop
    vr.start();
    return vr;
  });
}

window.ReactVR = { init };
