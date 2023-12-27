using Cinemachine;
using UnityEngine;

public class ParallaxController : MonoBehaviour
{

    [HideInInspector]
    public static ParallaxController Instance;
    
    public PlayerController playerController;

    public Transform[] planes;
    public float[] planeVelocity;

    [HideInInspector]
    public Vector3[] planesPosition;

    [Range(0, 1)]
    public float velocityScale = 1;

    public CinemachineVirtualCamera virtualCamera;

    private float parallaxEase;

    

    // Start is called before the first frame update
    void Start() {

        Instance = this;

        planesPosition = new Vector3[planes.Length];
        
        for (int index = 0; index < planes.Length; index++)
            planesPosition[index] = planes[index].position;
        

        for (int i = 0; i < planes.Length; i++) {

            if (planes[i].CompareTag("moon"))
                continue;

            if (planeVelocity[i] >= 1)
                planes[i].GetComponent<SpriteRenderer>().size *= new Vector2(planeVelocity[i], 1);

            
        }

    }

    // Update is called once per frame
    void Update()
    {


        virtualCamera = CameraController.Instance.virtualCamera;

        bool fewerThenOneAndAHalf = 1.5f > Mathf.Abs(virtualCamera.State.ReferenceLookAt.x - virtualCamera.State.CorrectedPosition.x);
        bool greaterThenZeroAndAHalf = Mathf.Abs(virtualCamera.State.ReferenceLookAt.x - virtualCamera.State.CorrectedPosition.x) > 0.2f;




        if (fewerThenOneAndAHalf && greaterThenZeroAndAHalf) { //isInDeadeZone
            parallaxEase += parallaxEase < 1 ? Time.deltaTime : 0;
            Parallaxing();
        } else
            parallaxEase -= parallaxEase > 0 ? Time.deltaTime : 0;

        //Parallaxing();
    }

    void Parallaxing() {

        

            if (playerController.isMovingLeft && playerController.onLimit == false)             
            for (int i = 0; i < planes.Length; i++) {
                planes[i].position += (planeVelocity[i] * velocityScale) * Time.deltaTime * Vector3.right * parallaxEase;
                transform.rotation = Quaternion.identity;
            }


        if (playerController.isMovingRight && playerController.onLimit == false)
            for (int i = 0; i < planes.Length; i++) {
                planes[i].position += (planeVelocity[i] * velocityScale) * Time.deltaTime * Vector3.left * parallaxEase;
                transform.rotation = Quaternion.identity;
            }

    }


    public void Evento (){

       

    }

    

    
}
